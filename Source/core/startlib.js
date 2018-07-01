
var fs = require("fs");

global.GetDataPath=function GetDataPath(name)
{
    if(global.DATA_PATH.substr(global.DATA_PATH.length-1,1)!=="\\")
        global.DATA_PATH=global.DATA_PATH+"\\";
    return global.DATA_PATH+name;
}
global.GetCodePath=function GetCodePath(name)
{
    if(global.CODE_PATH.substr(global.CODE_PATH.length-1,1)!=="\\")
        return global.CODE_PATH+"\\"+name;
    else
        return global.CODE_PATH+name;
}



global.CheckCreateDir=function(Path,bHidden,IsFile)
{
    Path=Path.replace(new RegExp("/",'g'),"\\");
    if(!fs.existsSync(Path))
    {
        if(!bHidden)
            ToLog("Create: "+Path);

        var arr=Path.split('\\');
        var CurPath=arr[0];
        if(IsFile)
        {
            arr.length--;
        }

        for(var i=1;i<arr.length;i++)
        {

            CurPath+="\\"+arr[i];
            if(!fs.existsSync(CurPath))
            {
                fs.mkdirSync(CurPath);
            }

        }

        //fs.mkdirSync(path);
    };
}


global.CopyFiles=CopyFiles;
function CopyFiles(FromPath,ToPath,bRecursive)
{
    if(fs.existsSync(FromPath))
    {
        var arr=fs.readdirSync(FromPath)

        for(var i=0;i<arr.length;i++)
        {
            var name1=FromPath+"\\"+arr[i];
            var name2=ToPath+"\\"+arr[i];
            if(fs.statSync(name1).isDirectory())
            {
                if(bRecursive)
                {
                    //ToLog("Copy: "+name1+" -> "+name2);
                    if(!fs.existsSync(name2))
                        fs.mkdirSync(name2);
                    CopyFiles(name1,name2,bRecursive);
                }
            }
            else
            {
                //ToLog("Copy: "+name1+" -> "+name2);
                var data = fs.readFileSync(name1);
                var file_handle=fs.openSync(name2, "w");
                fs.writeSync(file_handle, data,0,data.length);
                fs.closeSync(file_handle);
            }
        }

    };
}

if(!global.ToLog)
global.ToLog=function (Str)
{
    console.log(Str);
}
