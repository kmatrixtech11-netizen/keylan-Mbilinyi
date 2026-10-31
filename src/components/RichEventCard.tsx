import React, { useState } from 'react';
import { Announcement } from '../types';
import { useAuth } from '../context/AuthContext';
import { CrystalBadge } from './CrystalBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  Bell,
  Pin,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  BookmarkCheck
} from 'lucide-react';

interface RichEventCardProps {
  announcement: Announcement;
  onRsvp?: (id: string) => void;
  onDelete?: (id: string) => void;
  isFeedBanner?: boolean;
}

export const RichEventCard: React.FC<RichEventCardProps> = ({
  announcement,
  onRsvp,
  onDelete,
  isFeedBanner = false
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(false);

  const isRsvped = Boolean(
    currentUser && announcement.rsvpUserIds?.includes(currentUser.uid)
  );

  const rsvpCount =
    (announcement.rsvpUserIds?.length ?? announcement.rsvpCount) || 0;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${announcement.title} - WaveLink Community`;
    const shareText = `${announcement.title}\n${announcement.eventLocation || ''} • ${announcement.eventDate || ''}`;

    if (navigator?.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (_) {
        // Fallback to clipboard
      }
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const handleToggleReminder = () => {
    setIsReminderSet((prev) => !prev);
  };

  return (
    <article
      className={`rounded-3xl bg-white dark:bg-[#131927] border border-slate-200/80 dark:border-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-200 overflow-hidden flex flex-col ${
        isFeedBanner ? 'border-blue-400/80 ring-2 ring-blue-500/10' : ''
      }`}
    >
      {/* Top Pinned Banner for Admin / Verified Orgs */}
      {announcement.isPinned && (
        <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 px-4 py-2 text-white flex items-center justify-between text-xs font-bold tracking-wide shadow-xs">
          <div className="flex items-center gap-1.5">
            <Pin size={13} className="fill-white rotate-45" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Pinned Community Bulletin
            </span>
          </div>
          <span className="text-[10px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold">
            Official Broadcast
          </span>
        </div>
      )}

      {/* Optional Header Event Banner Image */}
      {announcement.imageUrl && (
        <div className="relative w-full aspect-21/9 max-h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          {announcement.type && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-[#0F172A] dark:text-white shadow-sm border border-white/50">
                {announcement.type === 'schedule'
                  ? 'Church Schedule'
                  : announcement.type === 'event'
                  ? 'Community Event'
                  : 'Notice'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
        {/* Author & Header Metadata Row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={
                announcement.authorPhotoURL ||
                `https://api.dicebear.com/7.x/shapes/svg?seed=${announcement.authorId}`
              }
              alt={announcement.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <CrystalBadge
                  email={announcement.authorEmail}
                  name={announcement.authorName}
                  size="sm"
                />

                {/* Official Partner / Verified Entity Badge */}
                {(announcement.isOfficialPartner ||
                  announcement.partnerType ||
                  announcement.authorEmail === 'keylanmbilinyi5@gmail.com') && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-2xl text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800"
                    title="Verified Community Leader / Partner"
                  >
                    <Building2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {announcement.partnerBadgeTitle ||
                        (announcement.partnerType === 'church'
                          ? 'Church Leader'
                          : 'Official Leader')}
                    </span>
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>
                  {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span aria-hidden="true">·</span>
                <span>Community</span>
                {announcement.priority === 'urgent' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                      Urgent
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Delete action for Admin */}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(announcement.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-2xl transition"
              title="Delete Notice"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Headline & Body Text */}
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white tracking-tight leading-snug">
            {announcement.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>
        </div>

        {/* Formatted Event Metadata Fields (Date, Time, Location) */}
        {(announcement.eventDate ||
          announcement.eventTime ||
          announcement.eventLocation) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {announcement.eventDate && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-[#0F172A] dark:text-white text-xs font-semibold">
                <div className="p-2 rounded-xl bg-blue-500 text-white shrink-0 shadow-xs">
                  <Calendar size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Date</div>
                  <div className="truncate font-bold text-[#0F172A] dark:text-white">{announcement.eventDate}</div>
                </div>
              </div>
            )}

            {announcement.eventTime && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[#0F172A] dark:text-white text-xs font-semibold">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 shadow-xs">
                  <Clock size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Time</div>
                  <div className="truncate font-bold text-[#0F172A] dark:text-white">{announcement.eventTime}</div>
                </div>
              </div>
            )}

            {announcement.eventLocation && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-[#0F172A] dark:text-white text-xs font-semibold">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Venue</div>
                  <div className="truncate font-bold text-[#0F172A] dark:text-white">{announcement.eventLocation}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons & RSVP Counter Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          {/* RSVP Counter & Toggle Button */}
          <div className="flex items-center gap-2">
            {onRsvp && (
              <button
                type="button"
                onClick={() => onRsvp(announcement.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition active:scale-95 shadow-xs ${
                  isRsvped
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/20'
                }`}
              >
                <CheckCircle2 size={15} className={isRsvped ? 'fill-white text-emerald-600' : ''} />
                <span>{isRsvped ? 'Going (RSVPed)' : 'RSVP Going'}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Users size={14} className="text-slate-500" />
              <span>
                {rsvpCount} {rsvpCount === 1 ? 'Attending' : 'Attending'}
              </span>
            </div>
          </div>

          {/* Social Actions: Remind Me & Share */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleReminder}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition active:scale-95 ${
                isReminderSet
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-slate-50'
              }`}
              title="Set Event Reminder"
            >
              {isReminderSet ? (
                <>
                  <BookmarkCheck size={14} className="text-amber-600" />
                  <span>Reminder Set</span>
                </>
              ) : (
                <>
                  <Bell size={14} className="text-slate-500" />
                  <span>Remind Me</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
              title="Share Event / Announcement"
            >
              <Share2 size={14} className="text-slate-500" />
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
