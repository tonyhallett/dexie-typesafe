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
        
        public override int MethodIntellisenseIndex { get; } = 4;

        protected override async Task PickParameters()
        {
            await Typer.SelectSelectedIntellisenseOption();
            await Typer.TypeClosingQuote();
        }
    }
}
