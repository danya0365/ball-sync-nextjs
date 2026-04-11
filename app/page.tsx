import { DashboardView } from "@/src/presentation/components/dashboard/DashboardView";
import { createServerDashboardPresenter } from "@/src/presentation/presenters/dashboard/DashboardPresenterServerFactory";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const presenter = createServerDashboardPresenter();
  
  try {
    const viewModel = await presenter.getViewModel();
    return <DashboardView initialViewModel={viewModel} />;
  } catch (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl m-8">
        <h2 className="font-bold text-lg">System Error</h2>
        <p>Failed to load Dashboard data. Please check connection.</p>
      </div>
    );
  }
}
