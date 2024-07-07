const fs=require("fs/promises");

//open  (32) file descriptor
//read or write


//file descriptor=number assigned to open the file

//each open file has unique file descriptor

(async ()=>{
    const createFile=async(path)=>{
        let existingFileHandle;
        try{
            //need to check if file is already present here or not
            existingFileHandle=await fs.open(path,"r")

            
            //whenever open file we're going to close that too
            existingFileHandle.close()


            //if open function does not return error means there exists a file already
           return console.log(`The file ${path} already exists`)
        }catch(e){
            //if we catch error, means we don't have the file, and we should create it, using open method
            const newFileHandle=await fs.open(path,"w");    //flag=w, means that I am going to write into that file
            console.log("A new file was successfully created. ")

            newFileHandle.close()
        }
      

    }


    //commmands

    const CREATE_FILE="create a file"

    const commandFileHandler=await fs.open("./command.txt","r");    //r is flag that means that just going to read from the file

    commandFileHandler.on("change",async()=>{
        //need to close the file because our memory is also getting affected due to opening and closing of the file
     
        //get the size of our file
     
        const size=(await commandFileHandler.stat()).size;
        //allocate our buffer with size of file
        const buff=Buffer.alloc(size)
        //location at which we want to start filling our buffer
        const offset=0;
     
        //how many bytes we want to read
        const length=buff.byteLength;
        //with what position want to start read the file in command.txt
        const position=0;   
        //we always want to read the whole content(from beginning to all way to the end)
        await commandFileHandler.read(
            buff,
            offset,
            length,
            position
        );


        //decoder gets some 0's and 1's and turns into something meaningful
        //encoder gets something meaningful and turns into 
        // 0's and 1's 
        //node js only understands character encoder
     
        const command=(buff.toString("utf-8"));
        //create a file
        //create a file <path>

        if(command.includes(CREATE_FILE)){
            const filePath=command.substring(CREATE_FILE+1)
            createFile(filePath)
        }



    })

    //watcher...
   const watcher=fs.watch("./command.txt");
   for await(const event of watcher){
    if(event.eventType==="change"){
        commandFileHandler.emit("change")

    }
   }
})()



