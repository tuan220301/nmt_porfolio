# Nguyên tắc

- Không tạo thêm bất kì file markdown nào khi tôi không yêu cầu
- Update trực tiếp vào component hiện tại thay vì tạo thêm component mới
- Tuyệt đối không tạo thêm bất kì 1 file nào, cần gì thì update trực vào các file typescript luôn

# Tài liệu

- Nguồn: <https://v2.tiptap.dev/docs/editor/getting-started/configure>

## Logic

- Khi xoá project => xoá toàn bộ folder trong s3 có title tương ứng

## Lỗi hiện tại

- khi gọi api delete project bị lỗi sau:
  - Using existing MongoDB connection.
    📦 [delete/route.ts] Request received: {
    projectId: '6998484be0311351d3ff367a?t=1771587825844',
    userId: '67af4789bc2a4d2ec08d944c'
    }
    ❌ [delete/route.ts] Error: CastError: Cast to ObjectId failed for value "6998484be0311351d3ff367a?t=1771587825844" (type string) at path "_id" for model "PersonalProject"
        at SchemaObjectId.cast (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/schema/objectId.js:251:11)
        at SchemaType.applySetters (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/schemaType.js:1255:12)
        at SchemaType.castForQuery (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/schemaType.js:1673:17)
        at cast (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/cast.js:390:32)
        at Query.cast (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:4897:12)
        at Query._castConditions (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:2306:10)
        at model.Query._findOne (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:2630:8)
        at model.Query.exec (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:4446:80)
        at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        at async eval (webpack-internal:///(rsc)/./app/api/persional_project/delete/route.ts:32:29)
        at async CheckTokenInCookies (webpack-internal:///(rsc)/./app/api/config/index.ts:35:12)
        at async /Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:57228
        at async eT.execute (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:46851)
        at async eT.handle (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:58760)
        at async doRender (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1366:42)
        at async cacheEntry.responseCache.get.routeKind (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1588:28)
        at async DevServer.renderToResponseWithComponentsImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1496:28)
        at async DevServer.renderPageComponent (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1924:24)
        at async DevServer.renderToResponseImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1962:32)
        at async DevServer.pipeImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:922:25)
        at async NextNodeServer.handleCatchallRenderRequest (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/next-server.js:272:17)
        at async DevServer.handleRequestImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:818:17)
        at async /Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/dev/next-dev-server.js:339:20
        at async Span.traceAsyncFn (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/trace/trace.js:154:20)
        at async DevServer.handleRequest (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
        at async invokeRender (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/router-server.js:179:21)
        at async handleRequest (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/router-server.js:359:24)
        at async requestHandlerImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/router-server.js:383:13)
        at async Server.requestListener (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/start-server.js:141:13) {
    stringValue: '"6998484be0311351d3ff367a?t=1771587825844"',
    messageFormat: undefined,
    kind: 'ObjectId',
    value: '6998484be0311351d3ff367a?t=1771587825844',
    path: '_id',
    reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
        at new ObjectId (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/bson/lib/bson.cjs:2517:23)
        at castObjectId (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/cast/objectid.js:25:12)
        at SchemaObjectId.cast (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/schema/objectId.js:249:12)
        at SchemaType.applySetters (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/schemaType.js:1255:12)
        at SchemaType.castForQuery (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/schemaType.js:1673:17)
        at cast (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/cast.js:390:32)
        at Query.cast (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:4897:12)
        at Query._castConditions (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:2306:10)
        at model.Query._findOne (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:2630:8)
        at model.Query.exec (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/mongoose/lib/query.js:4446:80)
        at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        at async eval (webpack-internal:///(rsc)/./app/api/persional_project/delete/route.ts:32:29)
        at async CheckTokenInCookies (webpack-internal:///(rsc)/./app/api/config/index.ts:35:12)
        at async /Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:57228
        at async eT.execute (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:46851)
        at async eT.handle (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:58760)
        at async doRender (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1366:42)
        at async cacheEntry.responseCache.get.routeKind (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1588:28)
        at async DevServer.renderToResponseWithComponentsImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1496:28)
        at async DevServer.renderPageComponent (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1924:24)
        at async DevServer.renderToResponseImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:1962:32)
        at async DevServer.pipeImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:922:25)
        at async NextNodeServer.handleCatchallRenderRequest (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/next-server.js:272:17)
        at async DevServer.handleRequestImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/base-server.js:818:17)
        at async /Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/dev/next-dev-server.js:339:20
        at async Span.traceAsyncFn (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/trace/trace.js:154:20)
        at async DevServer.handleRequest (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
        at async invokeRender (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/router-server.js:179:21)
        at async handleRequest (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/router-server.js:359:24)
        at async requestHandlerImpl (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/router-server.js:383:13)
        at async Server.requestListener (/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/node_modules/next/dist/server/lib/start-server.js:141:13),
    valueType: 'string'
    }
    DELETE /api/persional_project/delete?project_id=6998484be0311351d3ff367a?t=1771587825844 500 in 205ms
