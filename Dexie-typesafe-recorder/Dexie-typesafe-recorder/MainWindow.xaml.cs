using Dexie_typesafe_recorder.Demos;
using System.Windows;

namespace Dexie_typesafe_recorder
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Button_Click(object sender, RoutedEventArgs e) 
            => await Recorder.RecordAsync(new TableGetDemo());
    }
}