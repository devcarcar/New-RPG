#include <bits/stdc++.h>
using namespace std;
#define int long long
 
void solve() {
  int n;
  cin >> n;
  string a, b;
  cin >> a >> b;
  int arra[n+2], arrb[n+2];
  for (int i = 1; i <= n; i++) {
    arra[i] = a[i-1] - '0';
   arrb[i] = b[i-1] - '0';
  }
 arra[0] = 1, arra[n+1] = 1, arrb[0] = 1, arrb[n+1] = 1;
 // for (int i = 0; i < n; i++) cout << a[i] << endl;
// for (int i = 0; i <= n+1; i++) cout << arra[i] << " " << i << endl;
  for (int i = 1; i <= n; i++) {
     if (arra[i] == 1) {
      if (arrb[i-1] == 0 && arrb[i+1] == 0) {
       arra[i] = 0;
       arrb[i-1] = 1;
       if (arrb[i+3] == 1) {
         arrb[i+3] = 0;
         arrb[i+1] = 1;
       }

      } else if (arrb[i-1] == 0) {
        arra[i] = 0;
        arrb[i-1] = 1;
      } else if (arrb[i+1] == 0) {
        arra[i] = 0;
        arrb[i+1] = 1;
      } else {
        /*
        for (int i = 0; i <= n+1; i++) cout << arra[i] << " ";
        cout << endl;
        for (int i = 0; i <= n+1; i++) cout << arrb[i] << " ";
        cout << endl;
        */
        cout << "NO" << endl;
        return;
      }
    }
  }
  cout << "YES" << endl;
  }
 
signed main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
 int test;
 cin >> test;
  while(test--) solve();
  return 0;
}