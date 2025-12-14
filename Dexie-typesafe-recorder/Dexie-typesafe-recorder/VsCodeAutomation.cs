using FlaUI.Core;
using FlaUI.Core.AutomationElements;
using FlaUI.UIA3;
using System.Diagnostics;

namespace Dexie_typesafe_recorder
{
    internal static class VsCodeAutomation {
        private static Application GetVsCodeApplication()
        {
            var processes = Process.GetProcessesByName("Code");

            var mainProcess = processes
                .First(p => p.MainWindowHandle != IntPtr.Zero);
            return Application.Attach(mainProcess);
        }

        public static (AutomationElement, UIA3Automation) GetVsCodeEditor()
        {
            var vsCode = GetVsCodeApplication();
            var automation = new UIA3Automation();
            var mainWindow = vsCode.GetMainWindow(automation);
            var editor =  mainWindow!.FindFirstDescendant(cf => cf.ByClassName("monaco-editor no-user-select  showUnused showDeprecated vs-dark"))!;
            return (editor, automation);
        }
    }
}
