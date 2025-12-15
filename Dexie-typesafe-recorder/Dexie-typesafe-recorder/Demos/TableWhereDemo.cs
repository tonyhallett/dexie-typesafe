using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    internal class TableWhereDemo : IDemo
    {
        public string GifName { get; } = "TableWhereDemo";

        public async Task TypeAsync()
        {
            var tableInboundEach = ".each((tableInboundItem, cursor) => {});";
            await Typer.Type("// virtual indexes examples");
            await Typer.NewLine();

            await Typer.Type("db.inbound.where(\"");
            await Task.Delay(1500);
            await Intellisense.DownAndSelect(1);
            await Typer.TypeQuote();
            await FunctionTyper.TypeParameterClosingBracket();
            await Intellisense.ShowDownAndSelect(3,1000);
            await Typer.Type($"(5){tableInboundEach}");
            await HoverCursorArgument();
            await HoverTableItem();
            await Typer.CtrlRightArrow(8,200);
            await Typer.NewLine();

            await Typer.Type("db.inbound.where([\"");
            await Task.Delay(500);
            await FunctionTyper.PickIntellisenseStringArgument(0);
            await FunctionTyper.PickAdditionalIntellisenseStringArgument(0);
            await Typer.Type("]).equals([1,1])");
            await Task.Delay(500);
            await Typer.MoveLeft(2);
            await Intellisense.ShowHover(1000);
            await Typer.Backspace();
            await Typer.Type("\"1\"");
            await Typer.CtrlRightArrow(3, 200);
            await Typer.Type(tableInboundEach);
            await HoverCursorArgument();
            await Typer.CtrlRightArrow(5, 200);

            await Typer.NewLine(2);
            
            await Typer.Type("// using :id, as is a string the \"string\" where clauses apply");
            await Typer.NewLine();
            await Typer.Type("db.outboundExplicit.where(\":id\").startsWith(\"1\").each((tableOutboundItem, cursor) => {});");
            await HoverCursorArgument();
            await HoverTableItem();
        }

        private async Task HoverCursorArgument()
        {
            await Typer.MoveLeft(9);
            await Intellisense.ShowHover(1500);
        }

        private async Task HoverTableItem()
        {
            await Typer.MoveLeft(9);
            await Intellisense.ShowHover(1500);
        }
    }
}
