<%@page import="java.net.URLEncoder"%>
<%@page import="java.util.Map"%>
<%@page import="edu.yale.its.tp.cas.client.CASAttrPrincipal"%>
<%@ page import="java.util.Enumeration" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%

	//删除cookies
	Cookie cookies[] = request.getCookies();
	for(int i=0;i<cookies.length;i++){
		cookies[i].setMaxAge(0);
	}
		//没有登录,设置为访客
		Cookie unifyCode = new Cookie("userId","1");
		Cookie userName = new Cookie("userName",URLEncoder.encode("匿名用户","utf-8"));
		// 设置cookie过期时间为24小时。
		unifyCode.setMaxAge(60*60*1);
		userName.setMaxAge(60*60*1);
		// 在响应头部添加cookie
		response.addCookie( unifyCode );
		response.addCookie( userName );

	String casLogoutURL = application.getInitParameter("casServerLogoutUrl");
	//String redirectURL = casLogoutURL+"?service="+URLEncoder.encode("http://172.22.114.135:6535/classList");
	String redirectURL = casLogoutURL+"?service="+URLEncoder.encode("http://cc.cqupt.edu.cn/classList");
	//String redirectURL = URLEncoder.encode("http://172.22.114.135:6535/subjectCenter/CquptCourseCenter/pages/classListFK.jsp");
	response.sendRedirect(redirectURL);
%>

