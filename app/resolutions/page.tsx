import { ResolutionView } from "@/src/presentation/components/resolutions/ResolutionView";
import { createServerResolutionPresenter } from "@/src/presentation/presenters/resolutions/ResolutionPresenterServerFactory";

export const dynamic = "force-dynamic";

export default async function ResolutionsPage() {
  const presenter = createServerResolutionPresenter();
  
  try {
    const viewModel = await presenter.getViewModel();
    return <ResolutionView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading resolutions:", error);
    return (
      <div className="p-8 text-center text-red-500">
        <h2>Failed to load resolution dashboard</h2>
        <p className="text-sm mt-2 opacity-70">Please check server logs.</p>
      </div>
    );
  }
}
