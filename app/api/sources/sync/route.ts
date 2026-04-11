import { NextResponse } from "next/server";
import { createServerSourcesPresenter } from "@/src/presentation/presenters/sources/SourcesPresenterServerFactory";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceName } = body;
    
    const presenter = createServerSourcesPresenter();
    await presenter.triggerManualSync(sourceName);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error triggering sync:", error);
    return NextResponse.json(
      { error: error.message || "Failed to trigger sync" },
      { status: 500 }
    );
  }
}
