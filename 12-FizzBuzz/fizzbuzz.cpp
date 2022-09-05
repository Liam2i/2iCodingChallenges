#include <iostream>
#include <list>
#include <vector>
#include <string>
#include <thread>
#include <future>
using namespace std;

list<string> fizzbuzzThread(int start, int end) {
	list<string> values;

	for (int i = start; i <= end; i++) {
		if (i % 3 == 0 && i % 5 == 0) {
			values.push_back("FizzBuzz ");
		} else if (i % 3 == 0) {
			values.push_back("Fizz ");
		} else if (i % 5 == 0) {
			values.push_back("Buzz ");
		} else {
			values.push_back(std::to_string(i) + " ");
		}
	}

	return values;
}

int main() {
	vector<future<list<string>>> threads(10);

	for (int i = 0; i < 10; i++) {
		int start = (i * 100) + 1;
		int end = (i + 1) * 100;
        threads[i] = async(fizzbuzzThread, start, end);
    }

	list<string> values;

	for (auto& th : threads) {
    	values = th.get();

		for(string s : values) {
			cout << s;
		}
    }

	//auto a = async(fizzbuzzThread, start, end);

	// for(string s : values) {
	// 	cout << s;
	// }

	cout << "\nDone";
	
	return 0;
}