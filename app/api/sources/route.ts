import { NextResponse } from "next/server";
import { createServerSourcesPresenter } from "@/src/presentation/presenters/sources/SourcesPresenterServerFactory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const presenter = createServerSourcesPresenter();
    const data = await presenter.getViewModel();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching sources data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources data" },
      { status: 500 }
    );
  }
}
