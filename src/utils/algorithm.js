/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * 206 反轉鏈表
 * @param {ListNode} head
 * @return {ListNode}
 *
 * 1. 迭代法
 *
 * 參考: https://leetcode-cn.com/problems/reverse-linked-list/solution/shi-pin-jiang-jie-die-dai-he-di-gui-hen-hswxy/
 */
var reverseList = function (head) {
  let prev = null,
    cur = head;
  while (cur != null) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
};
