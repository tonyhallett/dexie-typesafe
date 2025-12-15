namespace Dexie_typesafe_recorder.VsCode
{
    internal interface IVsCodeEditor { 
        System.Drawing.Rectangle BoundingRectangle { get; }
        void Focus();
    }
}
