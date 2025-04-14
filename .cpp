#include <bits/stdc++.h>
using namespace std;
#define int long long
bool search(vector<char> keys, int times, char target) {
  for (int i = 0; i < times; i++) {
    if (keys[i] == target) return false;
}
  return true;
}
void solve() {
  string arr= "abcdefghijklmnopqrstuvwxyz";
  int n;
  cin >> n;
  string s;
  cin >> s;
 // cout << n << " " << s << endl;
  vector<char> keys;
  vector<int> forward;
  vector<int> backward;
  vector<int> freqarr;
  forward.push_back(0);
  backward.push_back(0);
   for (int i = 0; i < n; i++) {
      forward.push_back(forward[i]);
    if (search(keys, keys.size(), s[i])) {
      forward[i+1]++;
      keys.push_back(s[i]);
    }
    }
keys.clear();
  reverse(s.begin(), s.end());
  for (int i = 0; i < n; i++) {
    backward.push_back(backward[i]);
    if (search(keys, keys.size(), s[i])) {
      backward[i+1]++;
      keys.push_back(s[i]);
    }
  }
  reverse(backward.begin() + 1, backward.end());
  /*
  for (int i = 0; i <= n+1; i++) cout << forward[i] << " ";
cout << endl;
  for (int i = 0; i <= n+1; i++) cout << backward[i] << " ";
  cout << endl;
  */
  int ans = 0;
  for (int i = 1; i <= n; i++) ans = max(ans, forward[i] + backward[i+1]);
  cout << ans << endl;
  }
signed main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
 int test;
 cin >> test;
  while(test--) solve();
  return 0;
}