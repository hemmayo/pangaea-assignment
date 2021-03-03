curl -X POST -H "Content-Type: application/json" -d '{ "url": "http://localhost:9001/test1"}' http://localhost:3000/subscribe/topic1
curl -X POST -H "Content-Type: application/json" -d '{ "url": "http://localhost:9002/test2"}' http://localhost:3000/subscribe/topic2
curl -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' http://localhost:3000/publish/topic1
