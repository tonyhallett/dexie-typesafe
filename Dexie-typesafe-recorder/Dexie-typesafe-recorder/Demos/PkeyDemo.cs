using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    /*
        In vscode initially
        interface TableItem {
          string:string;
          number:number;
          date:Date;
          boolean:boolean;
          numberOpt?:number
        }
    */
    class PkeyDemo : PKeyDemoBase
    {
        public override string GifName { get; } = "PkeyDemo";
        
        public override int MethodIntellisenseIndex { get; } = TableBuilderIndexes.PkeyMethodIndex;

        protected override Task PickParameters() =>  FunctionTyper.PickIntellisenseStringArgument(0);
        
    }
}
