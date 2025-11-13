```Makefile
CXX = g++
CXXFLAGS = -Wextra -Werror -Wall
EXEC = prog

# wildcard pour lister l'ensemble des fichiers matchant avec le patern
SRC = $(wildcard *.cpp)

# syntax pour faire de la substraction par référence
OBJ = $(SRC:.cpp=.o)

all : $(EXEC)

#le "%" désigne l'ensemble des fichiers qui matchent avec le patern
%.o : %.cpp
	$(CXX) $(CXXFLAGS) -o $@ -c $<

#$@ renvoie à la cible
#$^ renvoie à la liste de dépendance
#$< renvoie à la première dépendance de la liste

$(EXEC) : $(OBJ)
	$(CXX) -o $@ $^

clean :
	rm -rf *.o

mrproper : clean
	rm -rf $(EXEC)

tar : main.cpp math.cpp
	tar -cf exemple.tar main.cpp math.cpp

```