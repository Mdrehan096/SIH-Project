import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrainFront,
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Layers,
  Award,
  Globe,
  Radio,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 w-full border-t border-[#d8d4c7] bg-white text-slate-800 shadow-inner">
      {/* 1. Official National Tricolor Ribbon */}
      <div className="gov-rule w-full h-[5px]" />

      {/* 2. Official Ministry & Organization Header Strip */}
      <div className="bg-[#f4f1e9] border-b border-[#e5e1d5] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#092b4c] text-white flex items-center justify-center shadow-md flex-shrink-0 border-2 border-amber-400/50">
              <TrainFront className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e67718]">
                  Government of India • Ministry of Railways
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] font-mono text-slate-600 font-semibold">NR Delhi Division</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#092b4c] tracking-tight">
                Railway Train Work Management System (RailSync-AI)
              </h2>
              <p className="text-xs text-slate-600">
                Centre for Railway Information Systems (CRIS) • Smart India Hackathon (SIH 2026 PS 26027)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GIGW 3.0 Compliant</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>STQC Certified</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>Digital India</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Four Major Directory Link Columns */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          {/* Column 1: Core Operational Portals */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#092b4c] border-b-2 border-[#e67718] pb-1.5 inline-block">
              Operational Workspaces
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link to="/" className="hover:text-[#e67718] hover:underline flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#092b4c]" />
                  <span>01 TDS — Train Dispatch System</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#e67718] hover:underline flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#092b4c]" />
                  <span>02 TDMS — Crew Duty Management</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#e67718] hover:underline flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#092b4c]" />
                  <span>03 SMMS — Safety Monitoring System</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#e67718] hover:underline flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#092b4c]" />
                  <span>04 COA — Timetables & Path Diagrams</span>
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-[#e67718] hover:underline flex items-center space-x-1.5 font-semibold text-[#092b4c]">
                  <Layers className="w-3.5 h-3.5 text-[#e67718]" />
                  <span>CP-SAT AI Block Optimization Matrix</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Official Indian Railways & Ministry Portals */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#092b4c] border-b-2 border-[#e67718] pb-1.5 inline-block">
              Government Rail Portals
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a
                  href="https://indianrailways.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e67718] hover:underline flex items-center justify-between"
                >
                  <span>Ministry of Railways (Official)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://cris.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e67718] hover:underline flex items-center justify-between"
                >
                  <span>Centre for Railway Info Systems (CRIS)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e67718] hover:underline flex items-center justify-between"
                >
                  <span>National Portal of India (india.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://rdso.indianrailways.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e67718] hover:underline flex items-center justify-between"
                >
                  <span>RDSO Technical Standards Organisation</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ireps.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e67718] hover:underline flex items-center justify-between"
                >
                  <span>IREPS Railway E-Procurement Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance, Policies & Accessibility */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#092b4c] border-b-2 border-[#e67718] pb-1.5 inline-block">
              Governance & Policies
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <span className="hover:text-[#e67718] cursor-pointer hover:underline flex items-center space-x-1">
                  <span>Terms & Conditions of Portal Usage</span>
                </span>
              </li>
              <li>
                <span className="hover:text-[#e67718] cursor-pointer hover:underline flex items-center space-x-1">
                  <span>Privacy Policy & Data Protection (DPDP Act)</span>
                </span>
              </li>
              <li>
                <span className="hover:text-[#e67718] cursor-pointer hover:underline flex items-center space-x-1">
                  <span>Hyperlinking Policy & Linking Guidelines</span>
                </span>
              </li>
              <li>
                <span className="hover:text-[#e67718] cursor-pointer hover:underline flex items-center space-x-1">
                  <span>Web Content Accessibility (WCAG 2.1 Level AA)</span>
                </span>
              </li>
              <li>
                <span className="hover:text-[#e67718] cursor-pointer hover:underline flex items-center space-x-1">
                  <span>Right to Information (RTI) Transparency</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: 24x7 Helpdesk & Emergency Operations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#092b4c] border-b-2 border-[#e67718] pb-1.5 inline-block">
              Operations Control & Helplines
            </h3>
            <div className="space-y-2 text-slate-700">
              <div className="p-2.5 rounded bg-[#f4f1e9] border border-[#e5e1d5] space-y-1">
                <div className="flex items-center space-x-2 text-[#092b4c] font-bold">
                  <PhoneCall className="w-4 h-4 text-[#e67718]" />
                  <span>Railway Integrated Helpline: 139</span>
                </div>
                <p className="text-[11px] text-slate-600">Toll-free 24x7 all-India passenger & operations service.</p>
              </div>

              <div className="flex items-start space-x-2 text-[11px] text-slate-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#092b4c] flex-shrink-0 mt-0.5" />
                <span>Divisional Railway Manager Office, Northern Railway, State Entry Road, New Delhi — 110001</span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                <Mail className="w-3.5 h-3.5 text-[#092b4c] flex-shrink-0" />
                <span className="font-mono">retrack.support@cris.org.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official Certification, Security & Technology Strip */}
      <div className="border-t border-[#e5e1d5] bg-[#faf8f5] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-1 text-[#092b4c] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>National Security Architecture</span>
            </span>
            <span className="text-slate-300">|</span>
            <span>256-bit TLS Encryption</span>
            <span className="text-slate-300">|</span>
            <span>Zero-Trust Role Based Access (RBAC)</span>
            <span className="text-slate-300">|</span>
            <span>SHA-256 Digital Private Number (PN) Verification</span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-500">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Portal Availability: 99.98%</span>
            <span>•</span>
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Last Updated: 17 September 2026</span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Copyright & NIC/CRIS Hosting Credentials */}
      <div className="bg-[#092b4c] text-white px-6 py-4 pb-8 md:pb-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs pr-0 md:pr-48 lg:pr-56">
          <div>
            <p className="font-medium text-slate-200">
              © 2026 Ministry of Railways, Government of India. All Rights Reserved.
            </p>
            <p className="text-[11px] text-slate-400">
              Designed, Developed and Deployed for Indian Railways Central Operations by RETRACK Engineering Team.
            </p>
          </div>
          <div className="text-right text-[11px] text-amber-200/90 font-mono">
            <span>RailSync-AI Version 2.4.0 (Govt. Release)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
