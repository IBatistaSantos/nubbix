import { AuthPromoPanel } from "./_components/AuthPromoPanel";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-16 xl:p-24 bg-white relative z-10 min-h-screen lg:min-h-0">
        {children}
      </div>
      <AuthPromoPanel />
    </div>
  );
}
