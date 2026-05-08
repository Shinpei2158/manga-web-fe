import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { LicenseDetail } from "@/lib/admin-license-management/license-management.types";

type LicenseProofFilesPanelProps = {
  currentFile?: string;
  currentFileIsPdf: boolean;
  currentFileUrl?: string;
  selected: LicenseDetail;
  selectedFileIndex: number;
  selectedProofCount: number;
  onSelectFileIndex: (index: number) => void;
};

export function LicenseProofFilesPanel({
  currentFile,
  currentFileIsPdf,
  currentFileUrl,
  selected,
  selectedFileIndex,
  selectedProofCount,
  onSelectFileIndex,
}: LicenseProofFilesPanelProps) {
  const currentFileLabel = currentFile ? `File ${selectedFileIndex + 1}` : "";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Proof Files</h3>
        <span className="text-sm text-gray-500">
          {selectedProofCount} attached
        </span>
      </div>

      {selected.licenseFiles && selected.licenseFiles.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selected.licenseFiles.map((file, index) => {
              const active = index === selectedFileIndex;
              const fileLabel = `File ${index + 1}`;

              return (
                <button
                  key={`${file}-${index}`}
                  onClick={() => onSelectFileIndex(index)}
                  className={[
                    "max-w-full rounded-full border px-3 py-1.5 text-sm",
                    active
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                  title={fileLabel}
                >
                  <span className="block max-w-[240px] truncate">
                    {fileLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {currentFileUrl ? (
            <div className="overflow-hidden rounded-xl border">
              <div className="flex items-center justify-between gap-3 border-b bg-gray-50 px-4 py-2">
                <div className="truncate text-sm font-medium">
                  {currentFileLabel}
                </div>
                <a
                  href={currentFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  Open
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="relative h-[560px] bg-white">
                {currentFileIsPdf ? (
                  <iframe
                    src={currentFileUrl}
                    className="h-full w-full"
                    title="Proof document"
                  />
                ) : (
                  <Image
                    src={currentFileUrl}
                    alt="Proof document"
                    fill
                    unoptimized
                    sizes="(max-width: 1280px) 92vw, 900px"
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
          No proof files uploaded.
        </div>
      )}
    </div>
  );
}
