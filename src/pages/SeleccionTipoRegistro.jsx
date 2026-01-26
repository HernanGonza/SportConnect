// src/pages/SeleccionTipoRegistro.jsx
import React from 'react';
import { Button, Space, Typography, Layout } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './SeleccionTipoRegistro.module.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function SeleccionTipoRegistro() {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.container}>
          <Title level={2} className={styles.title}>
            ¿Cómo querés registrarte?
          </Title>
          <Paragraph className={styles.description}>
            Elegí el tipo de cuenta que mejor se adapta a vos
          </Paragraph>

          <Space direction="vertical" size="large" className={styles.options}>
            <Link to="/registro/jugador" className={styles.optionLink}>
              <Button block size="large" icon={<UserOutlined />} className={styles.playerButton}>
                <div className={styles.optionText}>
                  <strong>Soy jugador</strong>
                  <span>Reservá canchas, uníte a partidos y participá en torneos</span>
                </div>
              </Button>
            </Link>

            <Link to="/registro/club" className={styles.optionLink}>
              <Button block size="large" icon={<TeamOutlined />} className={styles.clubButton}>
                <div className={styles.optionText}>
                  <strong>Represento un club</strong>
                  <span>Gestioná canchas, reservas, stock y torneos</span>
                </div>
              </Button>
            </Link>
          </Space>

          <div className={styles.footer}>
            <Link to="/">Volver al inicio</Link>
          </div>
        </div>
      </Content>
    </Layout>
  );
}