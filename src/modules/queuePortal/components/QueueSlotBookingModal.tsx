import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import type { QueueServiceItem } from '../types/queuePortal.types';

export interface QueueSlotBookingModalProps {
  isOpen: boolean;
  service: QueueServiceItem | null;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: {
    serviceId: string;
    serviceName: string;
    branchName: string;
    date: string;
    timeSlot: string;
    customerName: string;
    customerPhone?: string;
  }) => Promise<{ ticketNumber: string; bookingId: string } | any>;
}

export const QueueSlotBookingModal: React.FC<QueueSlotBookingModalProps> = ({
  isOpen,
  service,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-23');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [customerName, setCustomerName] = useState<string>('Rahul Bhowmick');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedTicket, setGeneratedTicket] = useState<string>('');

  if (!isOpen || !service) return null;

  const timeSlots: string[] = [
    '09:45 AM',
    '10:30 AM',
    '11:15 AM',
    '12:00 PM',
    '02:30 PM',
    '03:15 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await onConfirmBooking({
        serviceId: service.id,
        serviceName: service.name,
        branchName: service.branchName,
        date: selectedDate,
        timeSlot: selectedSlot,
        customerName,
        customerPhone,
      });
      const ticket =
        res?.ticketNumber || `P-${Math.floor(100 + Math.random() * 900)}`;
      setGeneratedTicket(ticket);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-sm w-full p-4 sm:p-5 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-0.5">
              Slot Booked Successfully!
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Your appointment token has been reserved in system.
            </p>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 mb-4 text-left space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Token Ticket:</span>
                <span className="font-extrabold text-blue-600 text-sm">
                  {generatedTicket}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                  {service.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold text-slate-800">
                  {selectedDate} at {selectedSlot}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs shadow-blue-500/20 cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Book a Slot
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {service.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {service.branchName || service.categoryLabel}
              </p>
            </div>

            {/* Date Picker */}
            <div className="mb-2.5">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Select Visit Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            {/* Time Slot Chips */}
            <div className="mb-3">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-1.5 px-1 text-center rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Visitor Details */}
            <div className="space-y-2 mb-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Confirm & Book</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
