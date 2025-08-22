---
title: SZTU_ACM新生夏令营第一次训练赛
math: true
categories:
  - 语法
  - 题解
abbrlink: 24849
cover: https://ooo.0x0.ooo/2025/08/22/OfdG9r.jpg
date: 2025-08-03 21:00:00
---
## [A - Piling Up](https://vjudge.net/problem/AtCoder-abc363_a)

#### 题意

 给定当前评级 `R`（ $1 \le R \le 299$ ），计算提升评级所需的最小增加量，使得显示的 `^` 数量增加一次。

#### 思路

根据 `R` 除以 $100$ 取整确定当前等级段，计算下一个等级段起点，减去当前评级即为所需提升。
#### std

```cpp
#include <stdio.h>

int main() {
    int R;
    scanf("%d", &R);
    // (R / 100) 得到当前等级，+1 后乘 100 得到下一级起点，再减去 R 得所需提升
    printf("%d", (R / 100 + 1) * 100 - R);
    return 0;
}
```

## [B - You should output ARC, though this is ABC.](https://vjudge.net/problem/AtCoder-abc255_a)

#### 题意
输入一个 $2×2$ 矩阵及行列索引 `(R, C)`，输出矩阵中对应位置的元素。
#### 思路 
使用全局二维数组存储矩阵，输入坐标时减 $1$ 调整为 `0-index`，直接访问输出。
#### std

```cpp
#include <stdio.h>

const int MAXN = 2; // 定义常量 MAXN 表示矩阵大小，使用 const 表示值不可更改
int A[MAXN][MAXN];  // 定义 2×2 的整型矩阵 A，放在主函数外表示为全局变量，可在整个程序中访问

int main() {
    int r, c;
    scanf("%d%d", &r, &c); // 输入要访问的行号 r 和列号 c
    for (int i = 0; i < MAXN; i++) {
        for (int j = 0; j < MAXN; j++) {
            scanf("%d", &A[i][j]); // 读取矩阵元素 A[0][0] 到 A[1][1]
        }
    }
    printf("%d", A[r - 1][c - 1]); // 下标从 0 开始，需减 1 输出 A[r][c] 对应位置的值
    return 0;
}
```

## [C - Generalized ABC](https://vjudge.net/problem/AtCoder-abc282_a)

#### 题意
给定整数 `K`（ $1 \le K \le 26$ ），输出从字母 `'A'` 开始的前 `K` 个连续大写字母组成的字符串。
#### 思路
利用 ASCII 码 `'A'` 的值加上索引 `i` 依次输出对应字符。
#### std

```cpp
#include <stdio.h>

int main() {
    int K;
    scanf("%d", &K); // 输入一个整数 K，表示要输出前 K 个大写字母
    for (int i = 0; i < K; i++) {
        // 'A' 的 ASCII 值是 65，i + 'A' 即依次得到 A, B, C, ...
        printf("%c", i + 'A');
    }
    return 0;
}
```

## [D - Christmas Present](https://vjudge.net/problem/AtCoder-abc334_a)

#### 题意
给出球棒价格 `B` 和手套价格 `G`，价格高者对应的物品名称输出。
#### 思路
用三目运算符判断哪个价格更高，输出对应字符串。
#### std

```cpp
#include <stdio.h>

int main() {
    int B, G;
    scanf("%d%d", &B, &G); // 输入球棒和手套的价格
    // 三目运算符：若 B > G 则输出 "Bat"，否则输出 "Glove"
    printf(B > G ? "Bat" : "Glove"); 
    return 0;
}
```

## [E - Japanese Cursed Doll](https://vjudge.net/problem/AtCoder-abc363_b)
#### 题意 
有 `N` 个人当前头发长度，头发每天增长 $1$ ，求使得至少有 `P` 人头发长度达到 `T` 所需最少天数（若已满足输出 $0$ ）。
#### 思路
将头发长度从大到小排序，第 `P` 长头发与目标长度 `T` 比较差值，差值为正则为所需天数，否则为 $0$ 。
#### std

```cpp
#include <stdio.h>

const int MAXN = 1e2 + 5; // 定义数组最大长度常量
int L[MAXN];

int main() {
    int N, T, P;
    scanf("%d%d%d", &N, &T, &P); // 读取人数N、目标长度T、目标人数P
    for (int i = 1; i <= N; i++) {
        scanf("%d", &L[i]); // 读取每个人当前的头发长度
    }
    // 对头发长度进行排序，从大到小排列（冒泡排序）
    for (int i = 1; i <= N; i++) {
        for (int j = i + 1; j <= N; j++) {
            if (L[i] < L[j]) {
                // 交换两个数的值，用临时变量保存
                int temp = L[i];
                L[i] = L[j];
                L[j] = temp;
            }
        }
    }
    // 第 P 长的头发与目标长度 T 的差值（若已达到目标，差值为负）
    // 三目表达式：若差值 > 0 则输出差值，否则输出 0（表示已满足条件）
    printf("%d", T - L[P] > 0 ? T - L[P] : 0);
    return 0;
}
```
```cpp
#include <bits/stdc++.h>

int main()
{
    int N, T, P;
    std::cin >> N >> T >> P;
    std::vector<int> L(N);
    for (auto &x : L)   std::cin >> x;
    sort(L.begin(), L.end(), std::greater<int>());
    std::cout << std::max(0, T - L[P - 1]);
}
```
## [F - Christmas Trees](https://vjudge.net/problem/AtCoder-abc334_b)
#### 题意
从坐标 `A` 开始向左右无限延伸的道路上，每隔 `M` 米放一个圣诞树，求区间 `[L, R]` 内的圣诞树数量。
#### 思路
- 圣诞树的位置满足 `x = A + k * M`，`k` 为任意整数。
  
- 要统计区间 `[L, R]` 内符合条件的点数，需要找到：
  
    - **第一个不小于 `L` 的符合条件点 `nL`**，即满足 `nL >= L` 且 `nL = A + k1 * M`。
      
    - **最后一个不大于 `R` 的符合条件点 `nR`**，即满足 `nR <= R` 且 `nR = A + k2 * M`。
    
- 计算 `nL`：通过 `(A - L) % M` 求出 `L` 到满足条件点的偏移量，加上 `L` 得到 `nL`，同时用 `((...)+M)%M` 保证结果非负。
  
- 计算 `nR`：通过 `(R - A) % M` 求出 `R` 到满足条件点的偏移量，`R` 减去偏移量得到 `nR`，同样保证非负。
  
- 如果 `nR < nL`，说明区间内没有任何符合条件的点，输出 $0$ 。
  
- 否则，符合条件点在区间内形成等差数列，个数为 `(nR - nL) / M + 1`。

```cpp
#include <stdio.h>

int main() {
    int M;
    long long A, L, R;
    scanf("%lld%d%lld%lld", &A, &M, &L, &R);

    // 计算第一个不小于L且满足坐标为 A + k * M 的点 nL
    // (A - L) % M 表示从L到最近满足条件点的偏移，
    // 加M再取模保证结果非负，最终加回L得到第一个合法点
    long long nL = L + (((A - L) % M) + M) % M;

    // 计算最后一个不大于R且满足坐标为 A + k * M 的点 nR
    // (R - A) % M 表示从R往回最近满足条件点的偏移，
    // 加M再取模保证非负，最终用R减去偏移得到最后合法点
    long long nR = R - (((R - A) % M) + M) % M;

    if (nR < nL) {
        // 如果调整后的右边界小于左边界，说明区间内无符合条件的点
        printf("0");
    } else {
        // 计算区间内满足条件点的个数，等差数列项数公式
        printf("%lld", (nR - nL) / M + 1);
    }
    return 0;
}
```

## [G - Sanitize Hands](https://vjudge.net/problem/AtCoder-abc357_a)

#### 题意
有消毒剂可消毒 `M` 只手，`N` 个外星人依次有 $H_i$ 只手，计算能完全消毒的外星人数。
#### 思路
从第一个外星人开始用消毒剂，若剩余剂量不小于当前外星人手数，则计数加一，否则停止。
#### std

```cpp
#include <stdio.h>

int main() {
    int N, M;
    scanf("%d%d", &N, &M); // 读入外星人数N和消毒剂可消毒的手数M
    int cnt = 0;           // 计数器，记录能完全消毒的外星人数
    for (int i = 0; i < N; i++) {
        int H;
        scanf("%d", &H); // 读入第i个外星人的手数H
        M -= H;          // 用消毒剂消毒这只外星人的所有手
        if (M >= 0) {          // 剩余消毒剂仍足够
            cnt++; // 计数器加一
        } else {
            break; // 不够消毒时停止，剩余消毒剂用完但不计入
        }
    }
    printf("%d", cnt); // 输出能完全消毒的外星人数
    return 0;
}
```