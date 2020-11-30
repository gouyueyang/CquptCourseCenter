<%@page import="java.util.Map"%>
<%@ page import="java.security.Principal"%>
<%@ page import="org.jasig.cas.client.authentication.AttributePrincipal"%>
<%@ page import="java.util.Iterator"%>
<%@page import="cas.sso.encrypt.AES2"%>
<%@page import="cas.sso.encrypt.SHA2"%>
<%@ page import="java.util.UUID"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.security.MessageDigest"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	//cas-client-3.2.1版本集成。
    String uId = request.getRemoteUser();
    string target = request.getParameter("target");
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	String uenTicket = SHA2.encoderByMd5(uId + sdf.format(new Date()));
	Principal principal = request.getUserPrincipal();
	if (principal != null && principal instanceof AttributePrincipal) {
		AttributePrincipal aPrincipal = (AttributePrincipal) principal;
		//获取用户信息中公开的Attributes部分。
		Map<String, Object> map = aPrincipal.getAttributes();
	}
	if (uId != null) {
		String redirectUrl = String.format(target+"?userid=%s&kssign=%s", uId, uenTicket);
		response.sendRedirect(redirectUrl);
		return;
	}
%>