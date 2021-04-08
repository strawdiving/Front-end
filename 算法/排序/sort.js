
let arr = [3,44,38,50,47,15,36,26,27,2,46,26,19,50,48]

function bubbleSort(arr) {
    for(let i=0;i<arr.length-1;i++) {
        let flag = false
        for(let j=0;j<arr.length-i-1;j++) {
            if(arr[j]>arr[j+1]) {
               swap(arr,j,j+1)
               flag = true
            }
        }
        if(!flag) {
            break;
        }        
    }
    return arr
}
function bubbleSort1(arr,len) {
    for(let i= len-1;i>=0;i--) {
        let pos = 0
        for(let j=0;j<i;j++) {
            if(arr[j]>arr[j+1]) {
               swap(arr,j,j+1)
               pos = j+1
            }
        }
        len = pos+1            
    }
    return arr
}

function swap(arr,i,j) {
    let temp = arr[i];
    arr[i]=arr[j]
    arr[j]= temp;
}
//bubbleSort(arr,arr.length);

function selectionSort(arr) {
    for(let i=0;i<arr.length-1;i++) {
        let index = i
        for(j=i+1;j<arr.length;j++) {
            if(arr[index]>arr[j]) {
                index = j
            }
        }
        swap(arr,index,i)
    }
}
//selectionSort(arr)

function insertionSort(arr) {
    for(let i=1;i<arr.length;i++) {
        let temp = arr[i]
        let j;
        for(j=i;j>0&&temp<arr[j-1];j--) {
            arr[j] = arr[j-1]
        }
        arr[j] = temp
    }
}

    var quickSort = function(arr) {
        if(arr.length<=1) return arr
        let pivot = Math.floor(arr.length/2)
        let base = arr.splice(pivot,1)[0]
    
        let left = []
        let right = []
        for(let i=0;i<arr.length;i++) {
            if(arr[i] <= base) {
                left.push(arr[i])
            } else {
                right.push(arr[i]) 
            }
        }
    
        return quickSort(left).concat(base,quickSort(right))
    }
    
   

//quickSort(arr)
//console.log(quickSort(arr))

function mergeSort(arr,tempArr,left,right) {
    if(left<right) {
       let temp = Math.floor(arr.length/2)
       mergeSort(arr,tempArr,left,temp)
       mergeSort(arr,tempArr,temp+1,right)
       mergeArray(arr,tempArr,left,temp+1,right)
    }
}

function mergeArray(arr,tempArr,left,rightStart,rightEnd) {
    let leftEnd = rightStart-1
    let tempPos = left
    let nums = rightEnd-left+1
     
    while(left<=leftEnd&&rightStart<=rightEnd) {
        if(arr[left]<arr[rightStart])
        tempArr[tempPos++] = arr[left++]
        else 
        tempArr[tempPos++] = arr[rightStart++]
    } 
    while(left<=leftEnd) {
        tempArr[tempPos++] = arr[left++]
    }
    while(rightStart<=rightEnd) {
        tempArr[tempPos++] = arr[rightStart++]
    }
    for(let i=0;i<nums;i++)
    {
      arr[rightEnd] = tempArr[rightEnd]
      rightEnd--
    }
}

mergeSort(arr,new Array(arr.length),0,arr.length-1)
console.log(arr)