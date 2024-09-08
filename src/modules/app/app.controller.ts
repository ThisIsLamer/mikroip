import { FastifyReply } from "fastify";
import { Get, Public, Query, Reply } from "../../core/base";
import { jsonRPC } from "../../core/jsonRPC";

const ips: { id: string, ip: string }[] = []

export class AppController {
  @Get('/echo')
  @Public()
  echo() {
    return jsonRPC.success({ echo: 'This backend tiket iaas.store' })
  }



  @Get('/')
  @Public()
  public getIp(@Query('id') id: string, @Query('ip') ip: string, @Reply() reply: FastifyReply) {
    if (!id && !ip) return reply.code(404).send();

    function searchIp(id: string) {
      const searchedId = id === '1' ? '0' : '1';
      return { neighborIp: ips.find(_ => _.id === searchedId)?.ip ?? '0.0.0.0' };
    }

    const payload = ips.find(_ => _.id === id);
    if (payload) {
      payload.ip = ip
      return searchIp(id)
    }
    ips.push({ id, ip })
    return searchIp(id)
  }  
}