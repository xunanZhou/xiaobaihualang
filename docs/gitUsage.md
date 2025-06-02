#git 本地回到之前的commit

1. 场景1， 如果L3想要回到L2, 去掉L3变更， git reset -hard L2, main会指向L2  (问题, L2应该用哪个指代? 没看懂前面提到的Head~1是什么意思)
   1. 当前的
2. 场景2, 如果L3想要回到L2, 但备份L3变更, git branch L3, git reset -hard L2, main会指向L2, 如果想undo git checkout L3
3. 场景3, 如果想要回到L2, 但是不想删除L3, git reset -soft L2, 这时候L3在stages (问题，那么L2的变动再stages是否会和L3冲突?)