import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('admin')
export class AdminController {
    @Get()
    @Render('admin') // 📌 admin.ejs를 렌더링
    async adminPage(@Req() req: Request, @Res() res: Response) {
        if (!req.session.user || !req.session.user.is_admin) {
            //return res.redirect('/login'); // 
            return res.redirect('/login?error=admin_only'); // 📌 쿼리 파라미터로 메시지 전달
        }

        return {
            title: '관리자 페이지',
            user: req.session.user,
            css: '<link rel="stylesheet" href="/css/admin.css">', // 📌 admin.css 추가
            // script: '<script src="/js/admin.js"></script>' // 📌 admin.js 추가
        };
    }
}
