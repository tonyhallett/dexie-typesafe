using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    class PropModificationDemo : IDemo
    {
        public string GifName { get; } = "PropModificationDemo";

        public async Task TypeAsync()
        {
            await Typer.Type("db.demo.update(\"someid\",{ ");
            await Typer.NewLine();
            await Typer.Tab();
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.SelectSelectedOption();
            await Typer.Type(": new PropModification( nested => ({ ");
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.SelectSelectedOption();
            await Typer.Type(": `updated${nested.index}`})),});");
            Typer.Save();
        }
    }
}
