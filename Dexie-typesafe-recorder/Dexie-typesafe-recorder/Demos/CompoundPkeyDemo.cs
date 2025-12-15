using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    /*
        interface TableItem {
          compound1: string;
          compound2: number;
          compound3: Date;
          boolean: boolean;
        } 
   */
    class CompoundPkeyDemo : PKeyDemoBase
    {
        public override string GifName { get; } = "CompoundPkeyDemo";

        public override int MethodIntellisenseIndex { get; } = TableBuilderIndexes.CompoundPkeyMethodIndex;

        protected override async Task PickParameters()
        {
            await FunctionTyper.PickIntellisenseStringArgument(0);
            await FunctionTyper.PickAdditionalIntellisenseStringArgument(1);
        }
    }
}
