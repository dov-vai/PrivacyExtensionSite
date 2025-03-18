import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Activity, Settings, Users, Check } from 'lucide-react';

const LandingPage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative bg-white">
            {/* Navigation */}
            <nav className={`sticky top-0 z-50 w-full ${scrollPosition > 50 ? 'bg-white shadow-md' : 'bg-transparent'} transition-all duration-300`}>
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-8 w-8 text-indigo-600" />
                        <span className="text-xl font-bold">PrivacyGuard</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors">How It Works</a>
                        <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" onClick={() => window.location.href = '/login'}>Login</Button>
                        <Button onClick={() => window.location.href = '/register'}>Sign Up</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">Browse with confidence and privacy</h1>
                                <p className="text-xl text-gray-600">PrivacyGuard shields your online activity from trackers, ads, and malicious websites.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Get Started for Free</Button>
                                <Button size="lg" variant="outline" className="border-indigo-600 text-indigo-600">Learn More</Button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex -space-x-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                            <Users size={16} className="text-gray-500" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-600">Join 10,000+ privacy-conscious users</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-50 transform -rotate-12"></div>
                            <div className="relative bg-white p-4 rounded-xl shadow-xl">
                                <div className="aspect-w-16 aspect-h-9">
                                    <div className="w-full h-full bg-indigo-50 rounded-lg flex items-center justify-center">
                                        <Shield className="h-24 w-24 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Advanced Privacy Features</h2>
                        <p className="text-xl text-gray-600">PrivacyGuard offers comprehensive protection against digital threats.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <Eye className="h-12 w-12 text-indigo-600 mb-4" />
                                <CardTitle>Tracker Blocking</CardTitle>
                                <CardDescription>Block invasive trackers that follow your online activity across websites.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Blocks 3rd party trackers</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Prevents fingerprinting</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Detailed blocking reports</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <Lock className="h-12 w-12 text-indigo-600 mb-4" />
                                <CardTitle>HTTPS Encryption</CardTitle>
                                <CardDescription>Automatically upgrade connections to HTTPS for enhanced security.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Forces secure connections</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Warns about insecure sites</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Certificate validation</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <Activity className="h-12 w-12 text-indigo-600 mb-4" />
                                <CardTitle>Privacy Dashboard</CardTitle>
                                <CardDescription>Visualize and control what data websites can access.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Real-time monitoring</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Custom privacy rules</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Website privacy scores</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">How PrivacyGuard Works</h2>
                        <p className="text-xl text-gray-600">Simple, powerful privacy protection with just a few clicks.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Install the Extension</h3>
                                    <p className="text-gray-600">Add PrivacyGuard to your browser with just one click. Available for Chrome, Firefox, and Edge.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                                    <p className="text-gray-600">Sign up to sync your privacy settings across devices and access premium features.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Customize Your Protection</h3>
                                    <p className="text-gray-600">Set your privacy preferences or use our recommended settings for instant protection.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Browse with Confidence</h3>
                                    <p className="text-gray-600">Enjoy a faster, safer browsing experience with real-time privacy protection.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-50 transform rotate-12"></div>
                            <div className="relative bg-white p-4 rounded-xl shadow-xl">
                                <div className="aspect-w-16 aspect-h-9">
                                    <div className="w-full h-full bg-indigo-50 rounded-lg flex items-center justify-center">
                                        <Settings className="h-24 w-24 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Choose Your Privacy Plan</h2>
                        <p className="text-xl text-gray-600">Find the perfect plan for your privacy needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>Free</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">$0</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Basic tracker blocking</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>HTTPS encryption</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Privacy dashboard</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Get Started</Button>
                            </CardFooter>
                        </Card>

                        <Card className="transition-all duration-300 hover:shadow-lg border-indigo-600">
                            <CardHeader className="bg-indigo-50">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
                                    Most Popular
                                </div>
                                <CardTitle>Pro</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">$4.99</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Advanced tracker blocking</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Cross-device syncing</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Custom privacy rules</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Email tracking protection</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Subscribe</Button>
                            </CardFooter>
                        </Card>

                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>Enterprise</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">Custom</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>All Pro features</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Team management</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Security audits</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Dedicated support</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600">Join thousands of satisfied PrivacyGuard users.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="transition-all duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 italic">"{['PrivacyGuard has completely changed how I browse the web. I feel much safer online now.', 'This extension is a must-have for anyone who values their privacy. Simple to use and effective.', 'I love seeing all the trackers that get blocked. My browsing is faster and more private!'][i-1]}"</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <Users size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{['Jamie Smith', 'Alex Johnson', 'Taylor Williams'][i-1]}</p>
                                            <p className="text-sm text-gray-500">{['Software Developer', 'Marketing Specialist', 'Graphic Designer'][i-1]}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-indigo-600">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4 text-white">Ready to take control of your privacy?</h2>
                        <p className="text-xl mb-8 text-indigo-100">Join thousands of users who are browsing safer and faster with PrivacyGuard.</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">Get Started for Free</Button>
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-indigo-700">Learn More</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Shield className="h-6 w-6 text-indigo-400" />
                                <span className="text-xl font-bold">PrivacyGuard</span>
                            </div>
                            <p className="text-gray-400">Protecting your privacy online, one click at a time.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400">© {new Date().getFullYear()} PrivacyGuard. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;