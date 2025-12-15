using FlaUI.Core.AutomationElements;
using FlaUI.UIA3;
using System.Drawing;

namespace Dexie_typesafe_recorder.VsCode
{
    class VsCodeEditor : IVsCodeEditor
    {
        public VsCodeEditor(AutomationElement automationElement, UIA3Automation automation)
        {
            BoundingRectangle = automationElement.BoundingRectangle;
            _automationElement = automationElement;
            this.automation = automation;
        }

        public Rectangle BoundingRectangle { get; }

        private AutomationElement _automationElement;
        private readonly UIA3Automation automation;

        public void Focus()
        {
            _automationElement.Focus();
            automation.Dispose();
        }
    }
}
