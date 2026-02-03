// src/components/Footer.jsx
import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-secondary">
                S
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight">SportConnect</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              La plataforma líder para conectar jugadores y clubes de pádel en Misiones. 
              Elevamos el estándar del deporte en la región.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Plataforma</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Buscar Canchas</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Torneos</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Clubes</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Ranking</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <Mail size={18} className="text-primary" />
                info@sportconnect.com.ar
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <MapPin size={18} className="text-primary" />
                Posadas, Misiones
              </li>
              <li className="flex gap-4 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-all">
                  <Twitter size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <p>&copy; 2026 SportConnect. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}