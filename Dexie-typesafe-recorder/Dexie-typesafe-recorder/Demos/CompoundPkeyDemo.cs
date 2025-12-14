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
        public override int MethodIntellisenseIndex { get; } = 1;

        protected override async Task PickParameters()
        {
            await Typer.SelectSelectedIntellisenseOption();
            await Typer.TypeClosingQuote();

            await FunctionTyper.PickAdditionalParameter(1);
        }
    }
}
