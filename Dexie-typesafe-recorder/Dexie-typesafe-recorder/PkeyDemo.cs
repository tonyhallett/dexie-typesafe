namespace Dexie_typesafe_recorder
{
    class PkeyDemo : IDemo
    {
        public async Task TypeAsync()
        {
            // this can be in vscode initially
//            var tableItem = @"
//interface TableItem {
//  string:string;
//  number:number;
//  date:Date;
//  boolean:boolean;
//  numberOpt?:number
//}";

            await TypeTableBuilder();
            await SelectPkeyFromIntellisense();
            await SelectParameterWithIntellisenseFirstOption();
            await CloseParameter();
        }

        private Task TypeTableBuilder()
        {
            return Typer.Type("tableBuilder<TableItem>()");
        }

        private Task SelectPkeyFromIntellisense() => Typer.ShowIntellisenseDownAndSelect(4,1000);

        private async Task SelectParameterWithIntellisenseFirstOption()
        {
            await Typer.TypeParameterOpeningBracket();
            await Typer.TypeQuote();
            await Task.Delay(1000);
            await Typer.SelectIntellisense();
        }

        private async Task CloseParameter()
        {
            await Typer.TypeQuote();
            await Typer.TypeParameterClosingBracket();
        }
    }
}
