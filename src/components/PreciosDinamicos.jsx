// src/components/PreciosDinamicos.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from 'react';
import { Switch, Space } from 'antd';
import dayjs from 'dayjs';
import supabase from '../services/supabaseClient';
import styles from './PreciosDinamicos.module.css';

export default function PreciosDinamicos({ 
  clubId, 
  canchaId = null, 
  precioBase = 20000, 
  globalActivado = true, 
  minPrecio = 16000, 
  maxPrecio = 22000 
}) {
  const [individualActivado, setIndividualActivado] = useState(false);
  const [precioFinal, setPrecioFinal] = useState(precioBase);
  const [multiplicador, setMultiplicador] = useState(1.0);

  const NORMALIZADOR = 0.6;
  const SUAVIZADO = 0.3;
  const DEMANDA_PROMEDIO = 8;

  const [Mprevio, setMprevio] = useState(1.0);

  const fetchDemanda = useCallback(async () => {
    const horaActual = dayjs().format('HH:00');
    const fechaHoy = dayjs().format('YYYY-MM-DD');

    const { count } = await supabase
      .from('reservas')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('fecha', fechaHoy)
      .eq('hora_inicio', horaActual)
      .eq('cancha_id', canchaId);

    return count || 0;
  }, [clubId, canchaId]);

  useEffect(() => {
    const calcular = async () => {
      let demanda = await fetchDemanda();

      const hora = dayjs().hour();
      let factorHorario = 1.0;
      if (hora >= 18 && hora <= 22) factorHorario = 1.3;
      else if (hora < 8 || hora > 23) factorHorario = 0.7;

      demanda *= factorHorario;

      const R = demanda / DEMANDA_PROMEDIO;
      const Mcrudo = 1 + (R - 1) * NORMALIZADOR;
      const Mlimitado = Math.min(Math.max(Mcrudo, minPrecio / precioBase), maxPrecio / precioBase);
      const M = SUAVIZADO * Mlimitado + (1 - SUAVIZADO) * Mprevio;

      setMprevio(M);
      const nuevoPrecio = Math.round(precioBase * M / 100) * 100;
      setPrecioFinal(nuevoPrecio);
      setMultiplicador(parseFloat(M.toFixed(2)));
    };

    if (globalActivado || individualActivado) {
      calcular();
      const interval = setInterval(calcular, 60000);
      return () => clearInterval(interval);
    } else {
      setPrecioFinal(precioBase);
      setMultiplicador(1.0);
    }
  }, [globalActivado, individualActivado, clubId, canchaId, precioBase, minPrecio, maxPrecio, Mprevio, fetchDemanda]);

  const formatARS = (num) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);

  return (
    <div className={styles.container}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {!globalActivado && (
          <Space>
            <Switch checked={individualActivado} onChange={setIndividualActivado} size="small" />
            <span>Precio dinámico individual</span>
          </Space>
        )}
        {globalActivado || individualActivado ? (
          <>
            <div className={styles.precioContainer}>
              <div className={styles.precioLabel}>Precio actual:</div>
              <div className={styles.precioValor}>{formatARS(precioFinal)}</div>
              <div className={styles.multiplicador}>
                ×{multiplicador} {multiplicador > 1 ? '↑' : multiplicador < 1 ? '↓' : ''}
              </div>
            </div>
            <div className={styles.barra}>
              <div className={styles.barraLlena} style={{ width: `${((multiplicador - (minPrecio / precioBase)) / ((maxPrecio / precioBase) - (minPrecio / precioBase))) * 100}%` }} />
            </div>
          </>
        ) : (
          <div className={styles.precioFijo}>
            Precio fijo: {formatARS(precioBase)}
          </div>
        )}
      </Space>
    </div>
  );
}