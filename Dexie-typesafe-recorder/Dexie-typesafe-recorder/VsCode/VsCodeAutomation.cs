using FlaUI.Core;
using FlaUI.UIA3;
using System.Diagnostics;

namespace Dexie_typesafe_recorder.VsCode
{
    internal static class VsCodeAutomation {
        private static Application GetVsCodeApplication()
        {
            var processes = Process.GetProcessesByName("Code");

            var mainProcess = processes
                .First(p => p.MainWindowHandle != IntPtr.Zero);
            return Application.Attach(mainProcess);
        }

        public static IVsCodeEditor GetVsCodeEditor()
        {
            var vsCode = GetVsCodeApplication();
            var automation = new UIA3Automation();
            var mainWindow = vsCode.GetMainWindow(automation);
            var editor =  mainWindow!.FindFirstDescendant(cf => cf.ByClassName("monaco-editor no-user-select  showUnused showDeprecated vs-dark"))!;
            return new VsCodeEditor(editor, automation);
        }
    }
}
