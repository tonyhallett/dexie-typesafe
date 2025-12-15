using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    internal class TableGetDemo : IDemo
    {
        public string GifName { get; } = "TableGetDemo";

        public async Task TypeAsync()
        {
            await Typer.Type("db.table1.get(1)");
            await Task.Delay(1000);
            await Intellisense.ShowHover(1000);
            await Typer.Backspace(2);
            await Typer.Type("\"1\").then(table1Item => table1Item?.propStr);");
            await Typer.NewLine();
            await Typer.Type("db.table2.get([1,1])");
            await Task.Delay(1000);
            await Typer.Backspace(3);
            await Typer.Type("\"1\"]).then(tableItem2 => tableItem2?.propNum);");
        }
    }
}
