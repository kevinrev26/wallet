//Copyright: Yuriy Ivanov, 2017-2018 e-mail: progr76@gmail.com
var MAX_SUPER_VALUE_POW=(1<<30)*2;



// window.sha  = sha3_256;
// window.shaarr = sha3_array_256;


function GetHashWithValues(hash0,value1,value2,bNotCopy)
{
    var hash;
    if(bNotCopy)
        hash=hash0;
    else
        hash=hash0.slice();

    hash[0]=value1&0xFF;
    hash[1]=(value1>>>8) & 0xFF;
    hash[2]=(value1>>>16) & 0xFF;
    hash[3]=(value1>>>24) & 0xFF;

    hash[4]=value2&0xFF;
    hash[5]=(value2>>>8) & 0xFF;
    hash[6]=(value2>>>16) & 0xFF;
    hash[7]=(value2>>>24) & 0xFF;

    //hash.writeUIntLE(nonce,0,6);

    var arrhash=shaarr(hash);
    return arrhash;

}

function GetPowPower(arrhash)
{
    var SumBit=0;
    for(var i=0;i<arrhash.length;i++)
    {
        var CurSum=Math.clz32(arrhash[i])-24;
        SumBit+=CurSum;
        if(CurSum!==8)
            break;
    }
    return SumBit;
    // //чем меньше значение массива, тем больше сила
    // var index=0;
    // var arrsum=[0,0,0];
    // for(var i=0;i<arrhash.length;i++)
    // {
    //     var byte=arrhash[i];
    //     for(var b=7;b>=0;b--)
    //     {
    //         if((byte>>b) & 1)
    //         {
    //             index++;
    //             if(index>=3)
    //             {
    //                 return (arrsum[0]<<16)+(arrsum[1]<<8)+arrsum[2];
    //             }
    //         }
    //         else
    //         {
    //             arrsum[index]++;
    //         }
    //     }
    // }
    // return 0;
}

function GetPowValue(arrhash)
{
    //чем меньше значение, тем больше сила
    var value=(arrhash[0]<<23)*2 + (arrhash[1]<<16)  + (arrhash[2]<<8) + arrhash[3];
    value=value*256 + arrhash[4];
    value=value*256 + arrhash[5];

    return value;
}


//external nonce
function CreateNoncePOWExtern(arr0,BlockNum,count,startnone)
{
    var arr=[];
    for(var i=0;i<arr0.length;i++)
        arr[i]=arr0[i];
    if(!startnone)
        startnone=0;

    var maxnonce=0;
    var supervalue=MAX_SUPER_VALUE_POW;
    for(var nonce=startnone;nonce<=startnone+count;nonce++)
    {
        var arrhash=GetHashWithValues(arr,nonce,BlockNum,true);
        var value=GetPowValue(arrhash);

        if(value<supervalue)
        {
            maxnonce=nonce;
            supervalue=value;
        }
    }
    return maxnonce;
}



/////////////////////////////////////////
function CreateHashBody(body,Num,Nonce)
{

    var length=body.length-12;

    body[length+0]=Num&0xFF;
    body[length+1]=(Num>>>8) & 0xFF;
    body[length+2]=(Num>>>16) & 0xFF;
    body[length+3]=(Num>>>24) & 0xFF;
    body[length+4]=0;
    body[length+5]=0;

    length=body.length-6;
    body[length+0]=Nonce&0xFF;
    body[length+1]=(Nonce>>>8) & 0xFF;
    body[length+2]=(Nonce>>>16) & 0xFF;
    body[length+3]=(Nonce>>>24) & 0xFF;
    body[length+4]=0;
    body[length+5]=0;

    // body.writeUIntLE(Num,body.length-12,6);
    // body.writeUIntLE(Nonce,body.length-6,6);
    return shaarr(body);
}



function CreateHashBodyPOWInnerMinPower(arr,BlockNum,MinPow)
{
    var nonce=0;
    while(1)
    {
        var arrhash=CreateHashBody(arr,BlockNum,nonce);
        var power=GetPowPower(arrhash);
        if(power>=MinPow)
        {
            return nonce;
        }
        nonce++;
    }
}

/////////////////////////////////////////////////////