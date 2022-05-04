This is a Jupyter notebook extension to detect code smells

## Tool Idea

There is a shortage of tools for helping developers using Jupyter Notebooks
Very less work has been done regarding the bad code practices that exist in these notebooks and the work has been theoretical
We plan to explore various code smells that are specific to these notebooks
We are making a tool which will help developers find out about the possible anti-patterns and code smells in their notebook code


## Code Smells Detected (Release 1)

1.   Long Parameter List     -   A method or a function that has a long parameter list.
2.   Long Method             -   A method or a function that is too long
3.   Long Lambda Function    -	  A lambda function that is overly long, in term of the number of its characters.
4.   Large Class             -	  A class that has grown too large
5.   Long Message Chain      -   An expression that is accessing an object through a long chain of attributes or methods by the dot operator.
6.   Wildcard Imports        -   A wild card import from a module means loading all classes and functions from that module. All the components loaded may or may not be used and may cause conflicts.

Code Smells Detected (Release 2)
1. Fat cell  -  If the number of lines in a cell exceeds the threshold then it is called fat cell
2. Printing without print function - Trying to print multiple variables without print function in the same cell. Notebooks allow you to print variables without using  print statements. While parsing if there is no assignment we detect that for a variable.
3. Library imports not in the first cell - All library imports to be done in the first cell All imports should be in the first cell for reference.
4. Unused variables: Variables that are not used.
5. Running cells out of order - Losing exploration history makes it difficult to debug /to see the procedure to arrive at the code.
6. No separate cell for column drops - The cell containing column drop should not have any other code. If executed multiple times multiple columns will be removed.
7. Indistinguishable colors for graphs - Contrast colors between graph lines when using matplotlib. Using indistinguishable colors  can lead to mistaking one graph for another. 
8. !pip in random cells - Installation of files using !pip in a jupyter notebook in random cells and not in the beginning. Notebooks allow users to use terminal commands in cells. Sometimes the user mixes normal python code with these terminal commands and it leads to a lot of problems when trying to debug/ read code


## Features

*  Detection of fourteen code smells : Long parameter list, Long methods, Wild card imports, Large class, Long message chain, Long lambda function, Fat cell, Printing, ,without print function,Library imports not in first cell,Unused variables,Running cells out of order,No separate cell for column drops,Indistinguishable colors for graphs and !pip in random cells
*  Highlighting the lines of code in jupyter notebook where code smells are detected.
*  Showing all code smells of current cell in message box
*  Displaying the metrics values of detected code smells in the console.


Code Smell             |     Threshold                                    |               Color     
---|---|---
Long Parameter list    |     number of parameters > 5                     |              Light red
Long Methods           |    method lines of code > 100                    |              Light blue
Large Class            |    lines of code > 200                           |              Green
Long Lambda Function   |    number of characters in one expression > 80   |              Red
Wild Card Imports      |    -                                             |              Cyan
Long Message Chain     |    length of message chain > 4                   |              Yellow


## Installation

* Goto "~/miniconda3/Lib/site-packages/jupyter-contrib_nbextenstions/nbextentions" (to clone the project)
* Type:- git clone https://github.com/AnuraagReddy123/SmellDetector.git
* jupyter contrib nbextenstions install
* Now go to your desired Jupyter Nootbook 
* Select the code block you wish to check for code smells
* Press the thunder button in menu to detect code smells which are color coded
