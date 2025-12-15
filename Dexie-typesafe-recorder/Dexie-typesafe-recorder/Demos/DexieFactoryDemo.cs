using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    internal class DexieFactoryDemo : IDemo
    {
        public string GifName { get; } = "DexieFactoryDemo";

        public async Task TypeAsync()
        {
            var populateCode = @"db.on(""populate"", tx => {
    
});
";
            await Typer.Type(populateCode);
            await Typer.MoveUp(2);
            await Typer.Tab();
            await Typer.Type("tx.table1.add({");
            await Intellisense.ShowCtrlSpace(500);
            await Intellisense.DownAndSelect(0);
            await Typer.Type(":\"\"});");
            await Task.Delay(1000);
            await Typer.MoveLeft(3);
            await Typer.Type(", ");
            await Intellisense.ShowCtrlSpace();
            await Intellisense.DownAndSelect(0);
            await Typer.Type(":\"\", bad:true");
            await Task.Delay(1000);
            await Typer.Delete(10);
            await Typer.MoveRight(3);
            await Typer.NewLine();
            await Typer.Tab();
            await Typer.Type("tx.table2.add({");
            await Intellisense.ShowCtrlSpace(500);
            await Intellisense.DownAndSelect(0);
            await Typer.Type(":1});");
            await Task.Delay(1000);
            await Typer.MoveDown(2);
            var transactionCode = @"db.transaction(""rw"", db.table1, tx => {
    // no table2

});
";
            await Typer.Type(transactionCode);
            await Typer.MoveUp(2);
            await Typer.Tab();
            await Typer.Type("tx.tab");
            await Task.Delay(1500);
            await Typer.Enter();
            await Typer.MoveLeft(1);
            await Intellisense.Rename("renamedTable1");
        }
    }
}
