using Dexie_typesafe_recorder.Typers;
using System;

namespace Dexie_typesafe_recorder.Demos
{
    internal class EqualityDemo : IDemo
    {
        public string GifName { get; } = "EqualityDemo";
        private const string eachCode = ".each((tableItem, cursor) => {});";

        public async Task TypeAsync()
        {
            await DemoWhereSingle();
            await Typer.NewLine();
            await DemoWhereComposite();
            await Typer.NewLine();
            await DemoGetSingleFilterEquality();
        }

        private async Task DemoWhereComposite()
        {
            await Typer.Type("const never = ");
            await TypeWhereAndComplete(1);
            await Typer.Type("({");
            await Typer.NewLineAndTab();
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.SelectSelectedOption();
            await Typer.Type(": 1,");
            await Typer.NewLineAndTab();
            await Intellisense.ShowCtrlSpace(500);
            await Intellisense.DownAndSelect(1);
            await Typer.Type(": new Date()");
            await Typer.NewLineAndTab();
            await Typer.Type("});");
            await Typer.MoveUp(3);
            await Typer.MoveRight(5);
            await Intellisense.ShowHover(1000);
            await Typer.MoveRight(6);
            await Typer.Backspace(14);
            await Typer.MoveDown(2);
            await Typer.MoveRight(2);
            await Typer.Type("//");
            await Typer.MoveDown(1);
            await Typer.Backspace(1);
            await Typer.Type(eachCode);
            await Typer.MoveLeft(9);
            await Intellisense.ShowHover(1000);
            await Typer.MoveUp(2);
            await Typer.NewLineAndTab();
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.SelectSelectedOption();
            await Typer.Type(": \"1\",");
            await Typer.MoveDown(2);
            await Intellisense.ShowHover(1000);
            await Typer.MoveUp(1);
            await Typer.MoveLeft(18);
            await Typer.Backspace(2);
            await Typer.MoveDown(1);
            await Typer.MoveRight(18);
            await Intellisense.ShowHover(1000);
            await Typer.MoveRight(15);
        }

        private async Task DemoGetSingleFilterEquality()
        {
            await Typer.Type("const tableItemPromise = db.demo.get");
            await Task.Delay(1000);
            await Intellisense.DownAndSelect(4);
            await Typer.Type("({");
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.SelectSelectedOption();
            await Typer.Type(":\"1\"}, {");
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.DownAndSelect(5);
            await Typer.Type(":1});");
            await Typer.NewLine();
            await Typer.MoveUp(1);
            await Typer.MoveRight(7);
            await Intellisense.ShowHover(1000);
        }

        private async Task DemoWhereSingle()
        {
            await TypeWhereAndComplete(3);

            await Typer.Type("({");
            await Intellisense.ShowCtrlSpace(1000);
            await Intellisense.SelectSelectedOption();
            await Typer.Type(": 1})");
            await Task.Delay(500);
            await Typer.MoveLeft(5);
            await Intellisense.ShowHover(1000);
            await Typer.MoveRight(3);
            await Typer.Backspace();
            await Typer.Type("\"1\"");
            await Task.Delay(500);
            await Typer.CtrlRightArrow(2);
            await Typer.NewLine();
            await Typer.Tab();
            await Typer.Type(eachCode);
            await Typer.MoveLeft(9);
            await Intellisense.ShowHover(1000);
            await Typer.CtrlRightArrow(10);
        }

        private async Task TypeWhereAndComplete(int index)
        {
            await Typer.Type("db.demo.where");
            await Task.Delay(1000);
            await Intellisense.DownAndSelect(index);
            await Typer.CtrlRightArrow(5);
        }

    }
}
