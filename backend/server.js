const express=require('express')

const {PubSub}=require('@google-cloud/pubsub')

const app=express()

const pubsub=new PubSub({

keyFilename:

'/app/key/gke-pubsub.json'

})

app.get('/order',async(req,res)=>{

await pubsub

.topic('orders-topic')

.publishMessage({

data:Buffer.from(

'New Order'

)

})

res.send(

'Message Published'

)

})

app.listen(3000)
