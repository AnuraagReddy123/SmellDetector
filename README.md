This is a Jupyter notebook extension to detect code smells

# TOOL IDEA

There is a shortage of tools for helping developers using Jupyter Notebooks
Very less work has been done regarding the bad code practices that exist in these notebooks and the work has been theoretical
We plan to explore various code smells that are specific to these notebooks
We are making a tool which will help developers find out about the possible anti-patterns and code smells in their notebook code


# CODE SMELLS Detected

1   Long Parameter List     -   A method or a function that has a long parameter list.
2   Long Method             -   A method or a function that is too long
3   Long Lambda Function    -	  A lambda function that is overly long, in term of the number of its characters.
4   Large Class             -	  A class that has grown too large
5   Long Message Chain      -   An expression that is accessing an object through a long chain of attributes or methods by the dot operator.
6   Wildcard Imports        -   A wild card import from a module means loading all classes and functions from that module. All the components loaded may or may not be used and may cause conflicts.


# Features

=>  Detection of six code smells : Long parameter list, Long methods, Wild card imports, Large class, Long message chain and Long lambda function.
=>  Highlighting the lines of code in jupyter notebook where code smells are detected.
=>  Displaying the metrics values of detected code smells in the console.


Code Smell                  Threshold                                       Color      
Long Parameter list         number of parameters > 5                        Light red
Long Methods                method lines of code > 100                      Light blue
Large Class                 lines of code > 200                             Green
Long Lambda Function        number of characters in one expression > 80     Red
Wild Card Imports           -                                               Cyan
Long Message Chain          length of message chain > 4                     Yellow


# Installation

Goto "~/miniconda3/Lib/site-packages/jupyter-contrib_nbextenstions/nbextentions" (to clone the project)
Type:-
git clone https://github.com/AnuraagReddy123/SmellDetector.git
jupyter contrib nbextenstions install
Now go to your desired Jupyter Nootbook 
Select the code block you wish to check for code smells
Press the thunder button in menu to detect code smells which are color coded
