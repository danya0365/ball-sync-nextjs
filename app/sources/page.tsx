import { SourcesView } from "@/src/presentation/components/sources/SourcesView";
import { createServerSourcesPresenter } from "@/src/presentation/presenters/sources/SourcesPresenterServerFactory";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const presenter = createServerSourcesPresenter();
  
  try {
    const viewModel = await presenter.getViewModel();
    return <SourcesView initialViewModel={viewModel} />;
  } catch (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl m-8">
        <h2 className="font-bold text-lg">System Error</h2>
        <p>Failed to load data sources. Please refresh.</p>
      </div>
    );
  }
}
