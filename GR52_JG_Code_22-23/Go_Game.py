# from tkinter import *
import os
import webbrowser
from tkinter import *

# Create object
root = Tk()

# Adjust size
root.geometry("400x400")

# Add image file
bg = PhotoImage( file = "goboard.png")
label1 = Label( root, image = bg )
label1.place(x = 0,y = 0)

# Add text
label2 = Label( root, text = "Welcome To The Game Of Go" , bg='grey' , fg="white" , font="Helvetica 10 bold")

label2.pack(pady = 50)

def got_clicked_home():
    filename = 'file:///'+os.getcwd()+'/' + 'game_menu.html'
    webbrowser.open_new_tab(filename)

def got_clicked_human_vs_human():
    filename = 'file:///'+os.getcwd()+'/' + 'human_game.html'
    webbrowser.open_new_tab(filename)

def got_clicked_artificialIntelligence_vs_artificial_Intelligence():
    filename = 'file:///'+os.getcwd()+'/' + 'human_vs_bot.html'
    webbrowser.open_new_tab(filename)

my_button_home = Button(text="HOME", command=got_clicked_home)
my_button_human = Button(text="Against human", command=got_clicked_human_vs_human)
my_button_bot = Button(text="Against AI", command=got_clicked_artificialIntelligence_vs_artificial_Intelligence)

my_button_home.pack(pady = 20);
my_button_bot.pack(pady = 20)
my_button_human.pack(pady = 20);

# Execute tkinter
root.mainloop()