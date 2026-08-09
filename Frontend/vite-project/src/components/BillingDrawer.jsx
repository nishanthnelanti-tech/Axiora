const BillingDrawer = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0d0f14] border-l border-white/[0.08] text-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Billing</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Current plan</p>
            <p className="mt-1 text-lg font-semibold text-white">Free</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Usage</p>
            <p className="mt-1 text-white">No billing details available yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDrawer;
