using Dexie_typesafe_recorder.Typers;

namespace Dexie_typesafe_recorder.Demos
{
    internal class UpgradeDemo : IDemo
    {
        public string GifName { get; } = "UpgradeDemo";
        public async Task TypeAsync()
        {
            // start with cursor on Friends
            await Intellisense.Rename("FriendsV1");
            await Typer.MoveDown(17);
            await Typer.Type("""

interface Friends {
  id: number;
  firstName: string;
  lastName: string;
}

""");
            await Typer.NewLine();
            await Typer.Type("""
const dbV2 = upgrade(dbV1, {
  toDelete: null,
  friends: tableBuilder<Friends>().autoPkey("id").index("firstName").index("lastName").build(),
}, tx => {
  return tx.friends.toCollection().modify((friendV1, ctx) => {
    const nameParts = friendV1.name.split(' ');
    ctx.value = { 
      firstName: nameParts[0]!,
      lastName: nameParts[1]!
    }
  });
});

""");
            await Typer.Type("dbV2.friends.where(\"");
            await Task.Delay(2000);
            await Typer.Backspace(15);
            await Typer.Type("toDel");
            await Task.Delay(1000);
            await Typer.Backspace(10);
            await Typer.MoveDown(1);
            await Typer.CtrlRightArrow(5);
            await Typer.Backspace(1);
            await Typer.Type("2");
        }
    }
}
