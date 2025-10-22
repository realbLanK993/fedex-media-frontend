"use client";
import { FileDown, Mail, Sparkles, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "../ui/theme-toggle";
// import { useAiStore } from "@/store/aiBar";
import Link from "next/link";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { aiAtom } from "@/store/temp-store";
import { isAuthenticatedAtom } from "@/store/authStore";
import { useRouter } from "next/navigation";
export default function OldNavbar() {
  const ai = useAtomValue(aiAtom);
  const setAI = useSetAtom(aiAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const router = useRouter();

  const downloadReport = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reports/report/download?main_company=FedEx&companies=FedEx&companies=DHL&companies=UPS&companies=India%20Post",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fedex-report.pdf";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      // You could add a toast notification here if you have one set up
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    setIsAuthenticated(false);
    router.push("/login");
  };
  return (
    <header className="p-4 border-b h-full max-h-[70px]">
      <nav className="flex justify-between gap-4">
        <Link href={"/dashboard/home"}>
          <span className="font-light text-2xl">FedEx Media Presence</span>
        </Link>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={downloadReport} size={"icon"}>
                {" "}
                <FileDown />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Report</p>
            </TooltipContent>
          </Tooltip>

          {isAuthenticated && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setAI(!ai)} size={"icon"}>
                  {" "}
                  <Sparkles />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ask AI</p>
              </TooltipContent>
            </Tooltip>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <Button onClick={logout} variant={"outline"}>
              Logout
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
