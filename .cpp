#include <bits/stdc++.h>
using namespace std;
#define int long long
 
void solve() {
  int n,m,k;
  cin >> n >> m >> k;
  int arr[k+1]
  arr[0] = 0;
  for (int i = 0; i < n; i++) {
int num;
cin >> num;
if (arr[num] == 1 || arr[num] == 2) arr[num] = 3;
else arr[num] = 1;
  }
  for (int i = 0; i < m; i++) {
int num;
cin >> num;
if (arr[num] == 1 || arr[num] == 2) arr[num] = 3;
else arr[num] = 2;
  }

  int a=0,b=0,c=0;
  for (int i = 1; i <= k; i++) {
if (arr[i] == 1) a++;
if (arr[i] == 2) b++;
else c++;
  }

if (a+b+c < k) cout << "NO" << endl;
else if (a <= k/2 && b <= k/2) cout << "YES" << endl;
else cout << "NO" << endl;
  }
 
signed main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
 int test;
 cin >> test;
  while(test--) solve();
  return 0;
}