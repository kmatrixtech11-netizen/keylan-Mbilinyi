import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ActiveTab, Announcement } from '../types';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { LegalModal, LegalDocType } from './LegalModals';
import {
  Crown,
  TrendingUp,
  Zap,
  HandCoins,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Smartphone,
  ExternalLink,
  ChevronRight,
  CalendarDays,
  Calendar,
  MapPin,
  Megaphone
} from 'lucide-react';

interface RightSidebarProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

const TRENDING_TOPICS = [
  { tag: '#WaveLinkTZ', category: 'Social & Trending', waves: '18.4k waves' },
  { tag: '#AirtelMoneyTZ', category: 'Mobile Payments', waves: '12.1k waves' },
  { tag: '#BongoCreatives', category: 'Music & Reels', waves: '9.8k waves' },
  { tag: '#DarTech2026', category: 'Innovation & AI', waves: '6.5k waves' },
  { tag: '#PostBoostTZ', category: 'Monetization', waves: '4.2k waves' },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigateTab }) => {
  const { currentUser, userProfile, isAdmin, isProEffective, isExemptFromPayments } = useAuth();
  const isProUser = isProEffective || isExemptFromPayments;
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);
  const [topAnnouncement, setTopAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setTopAnnouncement({ id: snap.docs[0].id, ...snap.docs[0].data() } as Announcement);
      } else {
        setTopAnnouncement(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <aside className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-4 py-5 pr-4 pl-1">
      {/* 1. WaveLink Pro Feature Highlights Card - Bright, Warm & Inviting */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-blue-600 via-sky-500 to-emerald-500 text-white shadow-md shadow-blue-500/15">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider border border-white/25">
            <Crown size={13} className="text-amber-300" />
            <span>WaveLink Pro VIP</span>
          </div>
          {isProUser && (
            <span className="text-[10px] font-bold text-emerald-900 bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
              Active VIP
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-base tracking-tight mb-1">
          {isProUser ? 'VIP Superpowers Active' : 'Amplify Your Wave Presence'}
        </h3>
        <p className="text-xs text-blue-50 mb-3.5 leading-relaxed font-medium">
          {isProUser
            ? '500MB uploads, 1080p WebRTC calls, free post boosts & zero platform advertisements.'
            : 'Unlock maximum reach, high-definition streams, and instant creator monetization.'}
        </p>

        {/* Pro Feature Checklist */}
        <div className="space-y-2 mb-4 text-xs text-white/95 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-amber-200 shrink-0" />
            <span>500MB Video &amp; Audio Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-amber-200 shrink-0" />
            <span>1080p HD Video &amp; Voice Calling</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-amber-200 shrink-0" />
            <span>Verified Blue Star Creator Badge</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-amber-200 shrink-0" />
            <span>100% Ad-Free Clean Feed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-amber-200 shrink-0" />
            <span>Complimentary 0 TZS Post Boosting</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('monetization')}
          className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
        >
          <span>{isProUser ? 'Manage Pro & Wallet' : 'Upgrade to Pro • 18k TZS/mo'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 2. Community Notice Board & Bulletins Spotlight */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <Megaphone size={16} />
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A]">
              Community Notices
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('announcements')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>Notice Board</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {topAnnouncement ? (
          <div
            onClick={() => onNavigateTab('announcements')}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-emerald-50/50 border border-blue-100 hover:border-blue-300 cursor-pointer transition group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-extrabold uppercase tracking-wider mb-1">
              <CalendarDays size={12} className="text-emerald-500" />
              <span>
                {topAnnouncement.type === 'schedule'
                  ? 'Church Schedule'
                  : topAnnouncement.type === 'event'
                  ? 'Event'
                  : 'Notice'}
              </span>
            </div>
            <h5 className="font-extrabold text-xs text-[#0F172A] group-hover:text-blue-600 transition line-clamp-2">
              {topAnnouncement.title}
            </h5>
            {(topAnnouncement.eventDate || topAnnouncement.eventLocation) && (
              <div className="mt-2 pt-2 border-t border-blue-100/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate font-medium">{topAnnouncement.eventDate || topAnnouncement.eventLocation}</span>
                <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                  {(topAnnouncement.rsvpUserIds?.length || 0)} Going
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
            <p className="font-medium">No bulletins yet.</p>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="mt-1 text-blue-600 hover:underline font-bold text-[11px]"
            >
              Post First Notice
            </button>
          </div>
        )}
      </div>

      {/* 3. Trending Topics in Tanzania */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp size={16} />
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A]">
              Trending on WaveLink
            </h4>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            East Africa
          </span>
        </div>

        <div className="space-y-1">
          {TRENDING_TOPICS.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => onNavigateTab('feed')}
              className="p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {topic.category}
                </span>
                <span className="font-bold text-xs text-[#0F172A] group-hover:text-blue-600 transition">
                  {topic.tag}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {topic.waves}
                </span>
              </div>
              <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Creator Monetization & Post Boosting Widget */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600">
              <Zap size={15} />
            </div>
            <span className="font-black text-xs uppercase tracking-wider">Creator Earnings</span>
          </div>
          <span className="text-[10px] bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            Mobile Money
          </span>
        </div>

        <h4 className="font-extrabold text-sm text-[#0F172A] mb-1">
          Post Boosting &amp; Tipping
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          Boost your post reach +300% for 2,000 TZS or receive instant tips directly to your mobile wallet.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Post Boost</span>
            <span className="font-extrabold text-sm text-blue-600">2,000 TZS</span>
            <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">+300% Reach</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Creator Tip</span>
            <span className="font-extrabold text-sm text-emerald-600">Instant</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">10% Platform Cut</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('monetization')}
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm shadow-blue-500/15"
        >
          <HandCoins size={14} />
          <span>Open Monetization Hub</span>
        </button>
      </div>

      {/* Footer Links & Copyright */}
      <div className="px-3 pt-1 pb-4 text-[11px] text-slate-400 space-y-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <button onClick={() => setLegalDoc('privacy')} className="hover:underline hover:text-blue-600">Privacy</button>
          <button onClick={() => setLegalDoc('terms')} className="hover:underline hover:text-blue-600">Terms</button>
          <button onClick={() => setLegalDoc('refund')} className="hover:underline hover:text-blue-600">Refund</button>
          <button onClick={() => onNavigateTab('announcements')} className="hover:underline hover:text-blue-600">Notice Board</button>
          <button onClick={() => onNavigateTab('monetization')} className="hover:underline hover:text-blue-600">Monetization</button>
        </div>
        <p className="text-[10px] pt-1">WaveLink © 2026. Empowering East African Creators.</p>
      </div>

      {legalDoc && (
        <LegalModal
          isOpen={true}
          initialDoc={legalDoc}
          onClose={() => setLegalDoc(null)}
        />
      )}
    </aside>
  );
};
